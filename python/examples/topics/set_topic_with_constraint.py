import asyncio

import diffusion
import diffusion.datatypes
from diffusion.features.topics.update.constraint_factory import ConstraintFactory

server_url = "ws://localhost:8080"
principal = "admin"
credentials = diffusion.Credentials("password")

path = "foo/bar"
topic_type = diffusion.datatypes.STRING
value = "bla bla"


# Because Python SDK for Diffusion is async, all the code needs to be
# wrapped inside a coroutine function, and executed using asyncio.run.
async def main():
    # creating the session
    async with diffusion.Session(
        url=server_url, principal=principal, credentials=credentials
    ) as session:
        await session.topics.remove_topic(path)
        await session.topics.add_topic(path, topic_type)
        print(f"Topic '{path} successfully added.")

        update_constraint = ConstraintFactory().no_value
        await session.topics.set_topic(path, "Value1", topic_type, update_constraint)
        print(
            "Topic value set successfully with 'Value1' as topic had no value originally."
        )
        update_constraint2 = ConstraintFactory().value(
            diffusion.datatypes.STRING("Value1")
        )
        await session.topics.set_topic(path, "Value2", topic_type, update_constraint2)
        print(
            "Topic value set successfully with 'Value2' as topic value was previously 'Value1'."
        )


if __name__ == "__main__":
    asyncio.run(main())
