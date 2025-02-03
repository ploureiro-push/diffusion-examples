/*******************************************************************************
 * Copyright (C) 2023 - 2024 DiffusionData Ltd.
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
package com.pushtechnology.client.sdk.example.timeseries;

import static com.pushtechnology.diffusion.datatype.DataTypes.DOUBLE_DATATYPE_NAME;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.topics.TopicControl;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicSpecification;
import com.pushtechnology.diffusion.client.topics.details.TopicType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TimeSeriesCreateTopicExample {
    private static final Logger LOG = LoggerFactory.getLogger(TimeSeriesCreateTopicExample.class);

    public static void main(String[] args) {
        try (Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080")) {

            final TopicControl.AddTopicResult result =
                session.feature(TopicControl.class).addTopic(
                        "my/time/series/topic/path", Diffusion.newTopicSpecification(TopicType.TIME_SERIES)
                            .withProperty(TopicSpecification.TIME_SERIES_EVENT_VALUE_TYPE, DOUBLE_DATATYPE_NAME)
                            .withProperty(TopicSpecification.TIME_SERIES_RETAINED_RANGE, "limit 15 last 10s")
                            .withProperty(TopicSpecification.TIME_SERIES_SUBSCRIPTION_RANGE, "limit 3"))
                    .join();

            if (result == TopicControl.AddTopicResult.CREATED) {
                LOG.info("Topic has been created.");
            }
            else {
                LOG.info("Topic already exists.");
            }
        }
    }
}
