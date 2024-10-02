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
from diffusion.features.topics.update.constraint_factory import (
    ConstraintFactory,
)
from diffusion.datatypes import JSON
from diffusion_examples.utils.program import Example


class AddAndSetTopicSessionLock(Example):
    async def run(
        self,
        server_url: str = "<url>",
        principal: str = "<principal>",
        password: str = "<password>",
    ):
        async with sessions().principal(principal).credentials(
            Credentials(password)
        ).open(server_url) as session:
            topic = "my/topic/path"
            json_data = {"diffusion": "data"}
            session_lock = await session.lock("SessionLock1")
            constraint = ConstraintFactory().locked(session_lock)
            result = await session.topics.add_and_set_topic(
                topic, JSON.with_properties(), JSON(json_data), constraint
            )
            if result == TopicAddResponse.CREATED:
                print("Topic has been created.")
            else:
                print("Topic already exists.")

            await asyncio.sleep(5)
            await session_lock.unlock()


if __name__ == "__main__":
    asyncio.run(
        AddAndSetTopicSessionLock().run(
            server_url="ws://localhost:8080",
            principal="admin",
            password="password",
        )
    )
