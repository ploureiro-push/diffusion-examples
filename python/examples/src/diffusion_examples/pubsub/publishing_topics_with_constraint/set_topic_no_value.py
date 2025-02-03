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
from diffusion import sessions, Credentials
from diffusion.features.topics import TopicAddResponse
from diffusion.datatypes import JSON
from diffusion_examples.utils.program import Example
from diffusion.features.topics.update.constraint_factory import ConstraintFactory


class SetTopicNoValue(Example):
    """
    Example class that demonstrates setting a topic value with no prior value.
    """

    TOPIC = "my/topic/path"

    async def run(
        self,
        server_url: str = "<url>",
        principal: str = "<principal>",
        password: str = "<password>",
    ):
        async with sessions().principal(principal).credentials(
            Credentials(password)
        ).open(server_url) as session:
            topic_specification = JSON.with_properties()

            result = await session.topics.add_topic(self.TOPIC, topic_specification)
            if result == TopicAddResponse.CREATED:
                print("Topic has been created.")
            else:
                print("Topic already exists.")

            json_data = {"diffusion": ["data", "more data"]}

            constraint = ConstraintFactory().no_value
            await session.topics.set_topic(
                self.TOPIC, JSON(json_data), topic_specification, constraint
            )

            print("Topic value has been set.")



if __name__ == "__main__":
    asyncio.run(
        SetTopicNoValue().run(
            server_url="ws://localhost:8080",
            principal="admin",
            password="password",
        )
    )
