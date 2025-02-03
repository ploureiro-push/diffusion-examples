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

export async function topicViewsDslOptionsTopicType() {
    /// tag::topic_views_dsl_options_topic_type[]
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.INT64);
    await session.topicUpdate.set(
        'my/topic/path',
        diffusion.datatypes.int64(),
        0,
        { specification: specification }
    );

    const topicView = await session.topicViews.createTopicView(
        'topic_view_1',
        'map my/topic/path to views/archive/<path(0)> type TIME_SERIES'
    );
    console.log(`Topic View ${topicView.name} has been created.`);

    for (let i = 0; i < 15; i++) {
        await session.topicUpdate.set(
            'my/topic/path',
            diffusion.datatypes.int64(),
            Date.now(),
            { specification: specification }
        );
        await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    const queryResult = await session.timeseries.rangeQuery()
        .fromStart()
        .selectFrom('views/archive/my/topic/path');
    for (const event of queryResult.events) {
        console.log(`${event.sequence} (${event.timestamp}): ${event.value}`);
    }
    /// tag::log
    expect(queryResult.events.length).toBe(10);
    /// end::log

    await session.closeSession();
    /// end::topic_views_dsl_options_topic_type[]
}
