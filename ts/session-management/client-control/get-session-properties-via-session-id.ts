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
/// tag::log
import { PartiallyOrderedCheckpointTester } from '../../../../test/util';
/// end::log

export async function clientControlGetSessionPropertiesViaSessionId(): Promise<void> {
    /// tag::log
    const check = new PartiallyOrderedCheckpointTester([[
        '$Country',
        '$ClientIP',
        '$Environment',
        '$SessionId',
        '$Transport',
        '$Principal',
        '$ServerName',
        '$StartTime',
        '$Language',
        '$Latitude',
        '$Connector',
        '$Longitude',
        '$ClientType',
        '$Roles',
    ]]);
    /// end::log
    /// tag::client_control_get_session_properties_via_session_id[]
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

    const properties = await session1.clients.getSessionProperties(
        session2.sessionId,
        clients.PropertyKeys.ALL_FIXED_PROPERTIES
    );
    console.log('Received the following session properties:');
    for (const key of Object.keys(properties)) {
        console.log(`  ${key}: ${properties[key]}`);
        /// tag::log
        check.log(`${key}`);
        /// end::log
    }

    await session1.closeSession();
    await session2.closeSession();
    /// end::client_control_get_session_properties_via_session_id[]
    /// tag::log
    await check.done();
    /// end::log
}
