"""
Copyright © 2024 Diffusion Data Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at
http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
"""

import asyncio
import contextlib

from diffusion import sessions, Credentials
from diffusion_examples.utils.program import Example
from diffusion.features.topics import TopicAddResponse
import diffusion.datatypes


class RemovingASingleTopicUsingTopicPath(Example):
    async def run(
        self,
        server_url: str = "<url>",
        principal: str = "<pricipal>",
        password: str = "<password>",
    ):
        async with sessions().principal(principal).credentials(
            Credentials(password)
        ).open(server_url) as session:
            topic = "my/topic/path/to/be/removed"
            topic_specification = diffusion.datatypes.JSON.with_properties()

            await self.add_topic(session, "self/topic1", topic_specification)
            await self.add_topic(session, "self/topic2", topic_specification)
            await self.add_topic(session, topic, topic_specification)

            await session.topics.remove_topic(topic)
            print("Topic has been removed.")

            await asyncio.sleep(5)


    async def add_topic(self, session, topic, topic_specification):
        result = await session.topics.add_topic(topic, topic_specification)
        if result == TopicAddResponse.CREATED:
            print("Topic has been created.")
        else:
            print("Topic already exists.")


if __name__ == "__main__":
    asyncio.run(
        RemovingASingleTopicUsingTopicPath().run(
            server_url="ws://localhost:8080",
            principal="admin",
            password="password",
        )
    )
