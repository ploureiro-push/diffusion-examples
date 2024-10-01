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

export async function timeSeriesEditValue() {

    // Connect to the server.
    const session = await diffusion.connect({
        host: 'localhost',
        port: 8080,
        principal: 'admin',
        credentials: 'password'
    });

    const specification = new diffusion.topics.TopicSpecification(diffusion.topics.TopicType.TIME_SERIES, {
        'TIME_SERIES_EVENT_VALUE_TYPE': 'double',
        'TIME_SERIES_RETAINED_RANGE': 'limit 15 last 10s',
        'TIME_SERIES_SUBSCRIPTION_RANGE': 'limit 3'
    });

    await session.topics.add('my/time/series/topic/path', specification);

    const metaData = [];
    for (let count = 0; count < 25; count++) {
        const value = Math.random();
        const result = await session.timeseries.append(
            'my/time/series/topic/path',
            value,
            diffusion.datatypes.double()
        );
        metaData.push(result);
    }

    const eventToEdit = metaData[10];
    await session.timeseries.edit(
        'my/time/series/topic/path',
        eventToEdit.sequence,
        3.14,
        diffusion.datatypes.double()
    );

    await session.closeSession();

}
