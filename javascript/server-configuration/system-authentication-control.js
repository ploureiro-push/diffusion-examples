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

export async function systemAuthenticationControl() {

    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const authenticationConfiguration1 = await session.security.getSystemAuthenticationConfiguration();
    console.log(JSON.stringify(authenticationConfiguration1, undefined, 4));

    console.log('Creating a new principal');
    const authenticationScript1 = session.security.authenticationScriptBuilder()
        .denyAnonymousConnections()
        .addPrincipal('observer', '12345', ['CLIENT_CONTROL', 'TOPIC_CONTROL', 'AUTHENTICATION_HANDLER'])
        .build();
    await session.security.updateAuthenticationStore(authenticationScript1);

    const authenticationConfiguration2 = await session.security.getSystemAuthenticationConfiguration();
    console.log(JSON.stringify(authenticationConfiguration2, undefined, 4));

    console.log('Adding ADMINISTRATOR roles to observer principal');
    const authenticationScript2 = session.security.authenticationScriptBuilder()
        .assignRoles('observer', ['ADMINISTRATOR'])
        .trustClientProposedPropertyIn('laptop', ['macbook', 'dell', 'lenovo'])
        .ignoreClientProposedProperty('calculator')
        .build();
    await session.security.updateAuthenticationStore(authenticationScript2);

    const authenticationConfiguration3 = await session.security.getSystemAuthenticationConfiguration();
    console.log(JSON.stringify(authenticationConfiguration3, undefined, 4));

    console.log('Removing observer principal');
    const authenticationScript4 = session.security.authenticationScriptBuilder()
        .allowAnonymousConnections([])
        .removePrincipal('observer')
        .build();
    await session.security.updateAuthenticationStore(authenticationScript4);

    const authenticationConfiguration4 = await session.security.getSystemAuthenticationConfiguration();
    console.log(JSON.stringify(authenticationConfiguration4, undefined, 4));

    await session.closeSession();

}
