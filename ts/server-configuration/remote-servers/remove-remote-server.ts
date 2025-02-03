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

import {
    connect,
    ConnectionOption,
    newRemoteServerBuilder,
    RemoteServerType,
} from 'diffusion';

export async function remoteServersRemove(): Promise<void> {
    /// tag::remote_servers_remove[]
    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const definition = newRemoteServerBuilder(RemoteServerType.SECONDARY_INITIATOR)
        .principal('admin')
        .credentials('password')
        .connectionOptions({
            [ConnectionOption.RECONNECTION_TIMEOUT] : '120000',
            [ConnectionOption.MAXIMUM_QUEUE_SIZE]: '1000',
            [ConnectionOption.CONNECTION_TIMEOUT]: '15000'
        })
        .missingTopicNotificationFilter('?abc')
        .build('Remote Server 1', 'ws://new.server.url.com');
    await session.remoteServers.createRemoteServer(definition);
    /// tag::log
    const remoteServers1 = await session.remoteServers.listRemoteServers();
    expect(remoteServers1.length).toBe(1);
    expect(remoteServers1[0].name).toBe('Remote Server 1');
    /// end::log

    await session.remoteServers.removeRemoteServer('Remote Server 1');
    /// tag::log
    const remoteServers2 = await session.remoteServers.listRemoteServers();
    expect(remoteServers2.length).toBe(0);
    /// end::log

    await session.closeSession();
    /// end::remote_servers_remove[]
}
