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

const diffusion = require('diffusion');

export async function trustClientProposedPropertyIn() {
    // Connect to the server.
    const session1 = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const authenticationScript1 = session1.security.authenticationScriptBuilder()
        .trustClientProposedPropertyIn('Flintstone', [ 'Fred', 'Wilma', 'Pebbles' ])
        .build();
    await session1.security.updateAuthenticationStore(authenticationScript1);

    const session2 = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'control',
        credentials: 'password',
        properties: {
            'Flintstone': 'Barney'
        }
    });

    const properties2 = await session1.clients.getSessionProperties(
        session2.sessionId,
        diffusion.clients.PropertyKeys.ALL_PROPERTIES
    );
    console.log('Received the following session properties:');
    for (const key of Object.keys(properties2)) {
        console.log(`  ${key}: ${properties2[key]}`);
    }

    await session2.closeSession();

    const session3 = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'control',
        credentials: 'password',
        properties: {
            'Flintstone': 'Fred'
        }
    });

    const properties3 = await session1.clients.getSessionProperties(
        session3.sessionId,
        diffusion.clients.PropertyKeys.ALL_PROPERTIES
    );
    console.log('Received the following session properties:');
    for (const key of Object.keys(properties3)) {
        console.log(`  ${key}: ${properties3[key]}`);
    }

    await session3.closeSession();

    await session1.closeSession();
}
