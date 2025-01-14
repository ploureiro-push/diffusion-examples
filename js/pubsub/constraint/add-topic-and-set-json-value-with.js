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
const { expectJsonTopicToHaveValue } = require('../../../../test/util');
/// end::log

export async function addTopicAndSetJsonValueWithConstraintExample() {
    /// tag::pub_sub_publish_with_constraint_add_and_set_topic_json_value_with[]
    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    try {
        const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.JSON);

        const jsonData = diffusion.datatypes.json().from({ diffusion: 'bar' });
        const topicCreationResult = await session.topicUpdate.set(
            'my/topic/path',
            diffusion.datatypes.json(),
            jsonData,
            { specification: specification }
        );

        if (topicCreationResult === diffusion.topicUpdate.TopicCreationResult.CREATED) {
            console.log('Topic has been created.');
        } else {
            throw new Error('Topic already exists.');
        }
        /// tag::log
        expect(topicCreationResult).toBe(diffusion.topicUpdate.TopicCreationResult.CREATED);
        /// end::log

        const updateConstraint = diffusion.updateConstraints()
            .jsonValue().with('/diffusion', 'bar', diffusion.topicUpdate.UpdateConstraintOperator.IS);

        const jsonData2 = diffusion.datatypes.json().from({ diffusion: 'baz' });
        await session.topicUpdate.set(
            'my/topic/path',
            diffusion.datatypes.json(),
            jsonData2,
            { constraint: updateConstraint }
        );

        console.log('Topic value has been set.');
    } catch (err) {
        console.error('Topic value could not be set.', err);
        throw err;
    }

    await session.closeSession();
    /// end::pub_sub_publish_with_constraint_add_and_set_topic_json_value_with[]
    /// tag::log
    await expectJsonTopicToHaveValue('my/topic/path', { diffusion: 'baz' });
    /// end::log
}
