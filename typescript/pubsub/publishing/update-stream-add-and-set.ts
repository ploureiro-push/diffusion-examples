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

import { connect, datatypes, topicUpdate, topics } from 'diffusion';

export async function updateSreamAddAndSetExample(): Promise<void> {
    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new topics.TopicSpecification(topics.TopicType.JSON);
    const jsonData = datatypes.json().from({ diffusion: 'data' });
    const updateStream = session.topicUpdate.newUpdateStreamBuilder()
        .specification(specification)
        .build('my/topic/path/with/update/stream', datatypes.json());
    const topicCreationResult = await updateStream.set(jsonData);
    if (topicCreationResult === topicUpdate.TopicCreationResult.CREATED) {
        console.log('Topic has been created.');
    } else {
        console.log('Topic already exists.');
    }

    await session.closeSession();
}
