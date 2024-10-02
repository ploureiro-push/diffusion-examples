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

export async function pubSubRemoveMultipleTopicsViaSelector() {

    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.JSON);
    const topicAddResult1 = await session.topics.add('my/topic/path/to/be/removed', specification);
    if (topicAddResult1.added) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }
    const topicAddResult2 = await session.topics.add('my/topic/path/to/be/also/removed', specification);
    if (topicAddResult2.added) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }

    const removalResult = await session.topics.remove('?my/topic/path/to/be//');
    console.log(`${removalResult.removedCount} topics have been removed.`);

    await session.closeSession();

}
