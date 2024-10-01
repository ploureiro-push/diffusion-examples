/*******************************************************************************
 * Copyright (C) 2023 Diffusion Data Ltd.
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

export async function addTopicAndSetAndConstraintExample() {

    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    try {
        const lock = await session.lock('My Session Lock');
        const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.JSON);
        const updateConstraint = diffusion.updateConstraints()
            .locked(lock)
            .and(diffusion.updateConstraints().noTopic());

        const jsonData = diffusion.datatypes.json().from({ diffusion: 'data' });
        await session.topicUpdate.set(
            'my/topic/path',
            diffusion.datatypes.json(),
            jsonData,
            { specification: specification, constraint: updateConstraint }
        );

        console.log('Topic value has been set.');
    } catch (err) {
        console.error('Topic value could not be set.', err);
        throw err;
    }

    await session.closeSession();

}
