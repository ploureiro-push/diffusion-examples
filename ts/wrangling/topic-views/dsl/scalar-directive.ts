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

import { connect, datatypes, topics } from 'diffusion';
/// tag::log
import { expectJsonTopicToHaveValue, PartiallyOrderedCheckpointTester } from '../../../../../test/util';
/// end::log

export async function topicViewsDslScalarDirective(): Promise<void> {
    /// tag::log
    const check = new PartiallyOrderedCheckpointTester([
        ['Subscribed to views/currency/USD/account/1234']
    ]);
    /// end::log
    /// tag::topic_views_dsl_scalar_directive[]
    // Connect to the server.
    const session = await connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new topics.TopicSpecification(topics.TopicType.JSON);
    const jsonData = datatypes.json().from({
        account: '1234',
        balance: {
            amount: 12.57,
            currency: 'USD'
        }
    });
    await session.topicUpdate.set(
        'my/topic/path',
        datatypes.json(),
        jsonData,
        { specification: specification }
    );

    const valueStream = session.addFallbackStream(datatypes.json());
    valueStream.on({
        subscribe : (topic, specification) => {
            console.log(`Subscribed to ${topic}`);
            /// tag::log
            check.log(`Subscribed to ${topic}`);
            /// end::log
        },
        unsubscribe : (topic, specification, reason) => {},
        value : (topic, spec, newValue, oldValue) => {}
    });

    await session.select('?views//');

    const topicView = await session.topicViews.createTopicView(
        'topic_view_1',
        'map my/topic/path to views/currency/<scalar(/balance/currency)>/account/<scalar(/account)>'
    );
    console.log(`Topic View ${topicView.name} has been created.`);

    await session.closeSession();
    /// end::topic_views_dsl_scalar_directive[]
    /// tag::log
    const expectedValue = {
        account: '1234',
        balance: {
            amount: 12.57,
            currency: 'USD'
        }
    };
    await expectJsonTopicToHaveValue('views/currency/USD/account/1234', expectedValue);

    await check.done();
    /// end::log
}
