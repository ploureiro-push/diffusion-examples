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

export async function subscribeSingleTopicExample() {

    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.JSON);
    await session.topics.add('my/topic/path', specification);

    const valueStream = session.addStream('my/topic/path', diffusion.datatypes.json());
    valueStream.on({
        subscribe : (topic, specification) => {
            console.log(`Subscribed to ${topic}`);
        },
        unsubscribe : (topic, specification, reason) => {
            console.log(`Unsubscribed from ${topic}: ${reason}`);
        },
        value : (topic, spec, newValue, oldValue) => {
            console.log(`${topic} changed from ${oldValue.get()} to ${newValue.get()}`);
        }
    });

    await session.select('my/topic/path');

    await session.closeSession();

}
