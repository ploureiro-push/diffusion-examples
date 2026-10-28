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

export async function initialConnectRetryExample(): Promise<void> {

    /*
        A retry policy provided within the connection options is employed when establishing
        a connection across the requested transport options.
     */
    let session: Session;
    try {
        // Connect to the server.
        session = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password',
            // Optional transports property stated for clarity only (this is where retry logic will apply).
            transports: ['WS'],
            // Retry up to 10 times, at a fixed interval
            retryPolicy: {
                attempts: 10,
                interval: 250
            }
        });
    } catch (err) {
        console.error('Connection could not be established despite retries.', err);
        throw err;
    }
    console.log(`Connected. Session Identifier: ${session.sessionId.toString()}`);

    /*
        A retry policy with a backoff, which adjusts the interval before each attempt
     */
    let session2: Session;
    try {
        // Connect to the server.
        session2 = await connect({
            host: 'localhost',
            port: 8080,
            principal: 'admin',
            credentials: 'password',
            // Optional transports property stated for clarity only (this is where retry logic will apply).
            transports: ['WS'],
            // Retry up to 10 times, at an interval that increases by 250 milliseconds with each attempt
            retryPolicy: {
                attempts: 10,
                interval: 250,
                backoff: (interval: number, attempt: number) => interval * attempt
            }
        });
    } catch (err) {
        console.error('Connection could not be established despite retries.', err);
        throw err;
    }
    console.log(`Connected. Session Identifier: ${session2.sessionId.toString()}`);

    // Insert work here

    await session.closeSession();
    await session2.closeSession();
}
