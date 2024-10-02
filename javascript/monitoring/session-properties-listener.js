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

export async function monitoringSessionPropertiesListener() {

    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const sessionEventStream = {
        onSessionEvent: (event) => {
            if (event.type === diffusion.SessionEventStreamEventType.STATE && event.state === diffusion.SessionState.ACTIVE) {
                console.log(`Session ${session.toString()} is now open with the following properties:`);
                for (const key of Object.keys(event.properties)) {
                    console.log(`  ${key}: ${event.properties[key]}`);
                }
            } else if (event.type === diffusion.SessionEventStreamEventType.STATE && event.state === diffusion.SessionState.CLOSED) {
                console.log(
                    `Session ${session.toString()} is now closed (${ClientCloseReason[event.closeReason]}) `
                    + `with the following properties:`
                );
                for (const key of Object.keys(event.properties)) {
                    console.log(`  ${key}: ${event.properties[key]}`);
                }
            } else {
                console.log(
                    `Session ${session.toString()} has been updated (${diffusion.SessionEventStreamEventType[event.type]}) `
                    + `with the following properties:`
                );
                for (const key of Object.keys(event.properties)) {
                    console.log(`  ${key}: ${event.properties[key]}`);
                }
            }
        },
        onClose: () => {},
        onError: () => {}
    };

    await session.clients.addSessionEventListener(sessionEventStream, {});

    await session.closeSession();

}
