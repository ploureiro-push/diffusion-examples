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

from __future__ import annotations

import abc
import contextlib
import functools
import inspect
import random
import struct
import typing

import structlog


from diffusion.features.control.session_trees.branch_mapping_table import (
    BranchMappingTable,
)
import diffusion

from diffusion_examples.default_creds import PASSWORD, PRINCIPAL, SERVER_URL

# Configure structlog
structlog.configure(
    processors=[
        structlog.stdlib.filter_by_level,
        structlog.processors.ExceptionPrettyPrinter(),
        structlog.processors.StackInfoRenderer(),
        structlog.processors.format_exc_info,
        structlog.processors.TimeStamper(fmt="iso"),
        structlog.processors.JSONRenderer(),
    ],
    context_class=dict,
    logger_factory=structlog.stdlib.LoggerFactory(),
    wrapper_class=structlog.stdlib.BoundLogger,
    cache_logger_on_first_use=True,
)


def random_double():
    # Generate a random 64-bit integer
    random_bits = random.getrandbits(64)
    # Pack this integer as a binary data in big-endian format (64-bit)
    packed = struct.pack(">Q", random_bits)
    # Unpack the binary data as a double-precision float
    random_float = struct.unpack(">d", packed)[0]
    return random_float


class ExampleMeta(type):
    def __call__(cls, *args, **kwargs):
        # Create an instance and call __init__
        instance = type.__call__(cls, *args, **kwargs)
        instance.values = []
        orig_run = instance.run

        @functools.wraps(orig_run)
        async def run_wrapper(*args, **kwargs):
            await instance.do_cleanup()
            await orig_run(*args, **kwargs)
            await instance.do_cleanup()

        run_wrapper.__self__ = instance
        run_wrapper.__signature__ = inspect.signature(orig_run)
        instance.run = run_wrapper
        return instance


class Example(metaclass=ExampleMeta):

    @abc.abstractmethod
    async def run(
        self,
        server_url: str = "<url>",
        principal: str = "<principal>",
        password: str = "<password>",
    ):
        ...


    @contextlib.asynccontextmanager
    async def cleanup_context(self):
        async with diffusion.Session(
                url=SERVER_URL, principal=PRINCIPAL, credentials=diffusion.Credentials(PASSWORD)
        ) as session:
            for entry in await session.session_trees.get_session_tree_branches_with_mappings():
                await session.session_trees.put_branch_mapping_table(
                    BranchMappingTable.Builder().create(entry))
            assert await session.session_trees.get_session_tree_branches_with_mappings() == []
            for entry in await session.metrics.list_session_metric_collectors():
                await session.metrics.remove_session_metric_collector(entry.name)
            for entry in await session.metrics.list_topic_metric_collectors():
                await session.metrics.remove_topic_metric_collector(entry.name)
            yield session

    async def do_cleanup(self):
        async with self.cleanup_context():
            return
