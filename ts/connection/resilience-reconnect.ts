/*******************************************************************************
 * Copyright (C) 2024 - 2026 Diffusion Data Ltd.
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

import { connect, Session } from 'diffusion';

export async function connectionReconnectExample(): Promise<void> {
    /*
        This example illustrates provision of a reconnection policy which attempts reconnection
        at fixed intervals, a finite number of times (for a fixed max duration).
        In most cases you can omit an explicit reconnection policy and your session will use the
        default policy. The default behaviour uses a randomised backoff approach
        (retrying at increasing & randomly staggered intervals), for a maximum period of one minute.
     */
    let sessionWithCustomReconnectBehaviour: Session;
    try {
        // Connect to the server.
        sessionWithCustomReconnectBehaviour = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password',
            reconnectionPolicy: {
                // Make up to 10 reconnection attempts, 3 seconds apart
                retryPolicy: {
                    attempts: 10,
                    interval: 3000
                },
                // Set the maximum amount of time the client will try and reconnect for to 10 minutes
                timeout: 1000 * 60 * 10
            }
        });
    } catch (err) {
        console.error('Connection could not be established.', err);
        throw err;
    }
    console.log(`Connected. Session Identifier: ${sessionWithCustomReconnectBehaviour.sessionId.toString()}`);

    /*
       For clarity, the simple and most common / recommended case
       - utilising the default randomised backoff reconnect behaviour
     */
    let sessionWithDefaultReconnectBehaviour: Session;
    try {
        // Connect to the server.
        sessionWithDefaultReconnectBehaviour = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password'
        });
    } catch (err) {
        console.error('Connection could not be established.', err);
        throw err;
    }
    console.log('Connected with staggered reconnect behaviour. Session Identifier: '
        + sessionWithDefaultReconnectBehaviour.sessionId.toString());

    /*
       Or less common, explicitly disabling reconnection...
     */
    let sessionWithNoReconnectBehaviour: Session;
    try {
        // Connect to the server.
        sessionWithNoReconnectBehaviour = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password',
            // A retry policy with no attempts disables reconnection
            reconnectionPolicy: { retryPolicy: { attempts: 0 } }
        });
    } catch (err) {
        console.error('Connection could not be established.', err);
        throw err;
    }
    console.log('Connected without reconnect behaviour. Session Identifier: '
        + sessionWithNoReconnectBehaviour.sessionId.toString());

    // Insert work here

    await sessionWithCustomReconnectBehaviour.closeSession();
    await sessionWithDefaultReconnectBehaviour.closeSession();
    await sessionWithNoReconnectBehaviour.closeSession();
}
