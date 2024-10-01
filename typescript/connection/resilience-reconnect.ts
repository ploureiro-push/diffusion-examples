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

import { connect, Session } from 'diffusion';

export async function connectionReconnectExample(): Promise<void> {

    let session: Session;
    let attempts = 0;

    try {
        // Connect to the server.
        session = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password',
            reconnect: {
                // Set the maximum amount of time the client will try and reconnect for to 10 minutes
                timeout: 1000 * 60 * 10,
                // The reconnection strategy is a function that is called when the session is
                // disconnected unexpectedly
                strategy: (reconnect: () => void, abort: () => void) => {
                    if (attempts > 10) {
                        // abort after 10 attempts
                        abort();
                    } else {
                        // retry after 3 seconds
                        setTimeout(reconnect, 3000);
                    }
                }
            }
        });
    } catch (err) {
        console.error('Connection could not be established.', err);
        throw err;
    }

    console.log(`Connected. Session Identifier: ${session.sessionId.toString()}`);

    // Insert work here

    await session.closeSession();

}
