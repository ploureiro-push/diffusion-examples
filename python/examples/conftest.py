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
import typing
import unittest.mock
from functools import wraps

import pytest
from hamcrest import assert_that, all_of, has_item, contains_string
from hamcrest.core.matcher import Matcher

from diffusion_examples.default_creds import PASSWORD, PRINCIPAL, SERVER_URL


def pytest_pycollect_makeitem(collector, name, obj):
    from diffusion_examples.utils.program import Example

    if (
        isinstance(obj, type)
        and issubclass(obj, Example)
        and obj is not Example
    ):
        result = pytest.Class.from_parent(collector, name=name, obj=obj)
        if result is not Example:
            return result


@pytest.fixture(autouse=True)
def server_url():
    return SERVER_URL


@pytest.fixture(autouse=True)
def principal():
    return PRINCIPAL


@pytest.fixture(autouse=True)
def password():
    return PASSWORD


@pytest.fixture(autouse=True)
def override_test_function_defaults(request):
    """Fixture to override default arguments of test functions."""
    import inspect
    original_function = request.node.obj  # Get the original test function
    argspec = inspect.getfullargspec(original_function)

    # Modify the default arguments within a new function
    @wraps(original_function)
    def wrapped_function(*args, **kwargs):
        for arg in zip(argspec.args, args):
            kwargs[arg[0]] = arg[1]

        for arg in set(argspec.args).intersection(set(request.fixturenames)):
            kwargs[arg] = request.getfixturevalue(arg)
        # Call the original function with the (potentially) modified arguments

        # noinspection PyUnresolvedReferences
        async def wrapper():
            nonlocal request
            self = original_function.__self__
            self.capsys = request.getfixturevalue("capsys")
            self.patched_sleep = unittest.mock.patch("asyncio.sleep")
            self.patched_sleep = self.patched_sleep.start()
            try:
                maybe_result = original_function(**kwargs)
                if inspect.isawaitable(maybe_result):
                    result = await maybe_result
                else:
                    result = maybe_result
                return result
            except Exception as e:
                raise e from None
            finally:
                self.patched_sleep.stop()

        return wrapper()
        # Replace the original test function with the wrapped one
    request.node.obj = wrapped_function


def assert_expected_results(
    actual_results: typing.Collection[str],
    expected_results: typing.Set[str],
) -> None:
    # Assert that each item in expected_results has a match in actual_results
    assert_that(
        actual_results,
        all_of(
            *(
                typing.cast(
                    typing.List[Matcher],
                    (
                        has_item(contains_string(expectedResult))
                        for expectedResult in expected_results
                    ),
                )
            )
        ),
    )
