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

import { connect, ConnectionOption, newRemoteServerBuilder } from 'diffusion';

export async function topicViewsDslRemoteTopicView(): Promise<void> {
    /// tag::topic_views_dsl_remote_topic_view[]
    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const definition = newRemoteServerBuilder()
        .principal('admin')
        .credentials('password')
        .connectionOptions({
            [ConnectionOption.RECONNECTION_TIMEOUT]: '120000',
            [ConnectionOption.MAXIMUM_QUEUE_SIZE]: '1000',
            [ConnectionOption.CONNECTION_TIMEOUT]: '15000'
        })
        .create('Remote Server 1', 'ws://new.server.url.com');
    await session.remoteServers.createRemoteServer(definition);

    const topicView = await session.topicViews.createTopicView(
        'topic_view_1',
        'map my/topic/path from \'Remote Server 1\' to views/remote/<path(0)>'
    );
    console.log(`Topic View ${topicView.name} has been created.`);

    await session.remoteServers.removeRemoteServer('Remote Server 1');
    await session.closeSession();
    /// end::topic_views_dsl_remote_topic_view[]
}
