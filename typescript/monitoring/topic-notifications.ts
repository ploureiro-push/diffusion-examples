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

import { connect, datatypes, Session, TopicNotificationListener, TopicNotificationType, topics } from 'diffusion';

export async function monitoringTopicNotifications(): Promise<void> {

    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const topicNotificationListener: TopicNotificationListener = {
        onTopicNotification: (path, specification, type) => {
            switch (type) {
                case TopicNotificationType.ADDED:
                    console.log(`Topic ${path} has been added.`);
                    break;
                case TopicNotificationType.SELECTED:
                    console.log(`Topic ${path} has been selected.`);
                    break;
                case TopicNotificationType.DESELECTED:
                    console.log(`Topic ${path} has been deselected.`);
                    break;
                case TopicNotificationType.REMOVED:
                    console.log(`Topic ${path} has been removed.`);
                    break;
            }
        },
        onDescendantNotification: (path, type) => {
            switch (type) {
                case TopicNotificationType.ADDED:
                    console.log(`Descendant Topic ${path} has been added.`);
                    break;
                case TopicNotificationType.SELECTED:
                    console.log(`Descendant Topic ${path} has been selected.`);
                    break;
                case TopicNotificationType.DESELECTED:
                    console.log(`Descendant Topic ${path} has been deselected.`);
                    break;
                case TopicNotificationType.REMOVED:
                    console.log(`Descendant Topic ${path} has been removed.`);
                    break;
            }
        },
        onClose: () => {},
        onError: (error) => {}
    };
    await session.notifications.addListener(topicNotificationListener);

    const specification = new topics.TopicSpecification(topics.TopicType.STRING);
    await session.topicUpdate.set(
        'my/topic/path',
        datatypes.string(),
        'Good morning',
        { specification: specification }
    );
    await session.topicUpdate.set(
        'my/other/topic/path',
        datatypes.string(),
        'Good afternoon',
        { specification: specification }
    );
    await session.topicUpdate.set(
        'other/path/of/the/topic/tree',
        datatypes.string(),
        'This will not generate a notification',
        { specification: specification }
    );

    await session.closeSession();

}
