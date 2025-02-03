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

export async function remoteServersCreatePrimaryInitiator() {
    /// tag::remote_servers_create_primary_initiator[]
    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const definition = diffusion.newRemoteServerBuilder(diffusion.RemoteServerType.PRIMARY_INITIATOR)
        .retryDelay(2500)
        .build(
            'Remote Server 1',
            ['ws://new.server.url.com:8080', 'ws://new.server.url.com:8081', 'ws://new.server.url.com:8082'],
            'High Volume Connector'
        );
    await session.remoteServers.createRemoteServer(definition);
    /// tag::log
    const remoteServers = await session.remoteServers.listRemoteServers();
    expect(remoteServers.length).toBe(1);
    expect(remoteServers[0].name).toBe('Remote Server 1');
    /// end::log


    // Clean up
    await session.remoteServers.removeRemoteServer('Remote Server 1');
    await session.closeSession();
    /// end::remote_servers_create_primary_initiator[]
}
