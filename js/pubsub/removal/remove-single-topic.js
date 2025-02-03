/*******************************************************************************
 * Copyright (C) 2024 Diffusion Data Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *******************************************************************************/

const diffusion = require('diffusion');
/// tag::log
const { expectTopicCounts } = require('../../../../test/util');
/// end::log

export async function pubSubRemoveSingleTopicViaPath() {
    /// tag::pub_sub_remove_single_topic_via_path[]
    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.JSON);
    const jsonData1 = diffusion.datatypes.json().from({ diffusion: [ 'data', 'more data' ] });
    const topicCreationResult1 = await session.topicUpdate.set(
        'my/topic/path/to/be/removed',
        diffusion.datatypes.json(),
        jsonData1,
        { specification: specification }
    );
    if (topicCreationResult1 === diffusion.topicUpdate.TopicCreationResult.CREATED) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }
    /// tag::log
    expect(topicCreationResult1).toBe(diffusion.topicUpdate.TopicCreationResult.CREATED);
    /// end::log

    const jsonData2 = diffusion.datatypes.json().from({ diffusion: [ 'no data' ] });
    const topicCreationResult2 = await session.topicUpdate.set(
        'my/topic/path/will/not/be/removed',
        diffusion.datatypes.json(),
        jsonData2,
        { specification: specification }
    );
    if (topicCreationResult2 === diffusion.topicUpdate.TopicCreationResult.CREATED) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }
    /// tag::log
    expect(topicCreationResult2).toBe(diffusion.topicUpdate.TopicCreationResult.CREATED);
    /// end::log

    const jsonData3 = diffusion.datatypes.json().from({ diffusion: [ 'no data either' ] });
    const topicCreationResult3 = await session.topicUpdate.set(
        'my/topic/path/will/not/be/removed/either',
        diffusion.datatypes.json(),
        jsonData3,
        { specification: specification }
    );
    if (topicCreationResult3 === diffusion.topicUpdate.TopicCreationResult.CREATED) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }
    /// tag::log
    expect(topicCreationResult3).toBe(diffusion.topicUpdate.TopicCreationResult.CREATED);
    /// end::log

    await session.topics.remove('my/topic/path/to/be/removed');
    console.log('Topic has been removed.');

    await session.closeSession();
    /// end::pub_sub_remove_single_topic_via_path[]
    /// tag::log
    expectTopicCounts({
        'my/topic/path/to/be/removed': 0,
        'my/topic/path/will/not/be/removed': 1,
        'my/topic/path/will/not/be/removed/either': 1
    });
    /// end::log
}
