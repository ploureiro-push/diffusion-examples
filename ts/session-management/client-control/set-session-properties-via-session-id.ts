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

import { clients, connect } from 'diffusion';

export async function clientControlSetSessionPropertiesViaSessionId(): Promise<void> {
    /// tag::client_control_set_session_properties_via_session_id[]
    // Connect to the server.
    const session1 = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    // Connect to the server.
    const session2 = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'client',
        credentials: 'password'
    });

    const properties1 = await session1.clients.getSessionProperties(
        session2.sessionId,
        clients.PropertyKeys.ALL_FIXED_PROPERTIES
    );
    console.log('Original session properties:');
    for (const key of Object.keys(properties1)) {
        console.log(`  ${key}: ${properties1[key]}`);
    }

    await session1.clients.setSessionProperties(
        session2.sessionId,
        { '$Language': 'en-gb' }
    );

    const properties2 = await session1.clients.getSessionProperties(
        session2.sessionId,
        clients.PropertyKeys.ALL_FIXED_PROPERTIES
    );
    console.log('Changed session properties:');
    for (const key of Object.keys(properties2)) {
        console.log(`  ${key}: ${properties2[key]}`);
    }
    /// tag::log
    expect(properties2['$Language']).toBe('en-gb');
    /// end::log

    await session1.closeSession();
    await session2.closeSession();
    /// end::client_control_set_session_properties_via_session_id[]
}
