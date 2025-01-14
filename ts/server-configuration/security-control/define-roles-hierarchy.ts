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

import { connect } from 'diffusion';

export async function securityControlDefineRolesHierarchy(): Promise<void> {
    /// tag::security_control_define_roles_hierarchy[]
    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const securityScript = session.security.securityScriptBuilder()
        .setRoleIncludes('OPERATOR', [ 'CLIENT', 'CLIENT_CONTROL' ])
        .build();
    console.log('OPERATOR now includes CLIENT and CLIENT_CONTROL roles.');
    console.log(securityScript);
    await session.security.updateSecurityStore(securityScript);

    // Clean up
    const securityScriptCleanup = session.security.securityScriptBuilder()
        .setRoleIncludes('OPERATOR', [ 'CLIENT' ])
        .build();
    await session.security.updateSecurityStore(securityScriptCleanup);
    await session.closeSession();
    /// end::security_control_define_roles_hierarchy[]
}
