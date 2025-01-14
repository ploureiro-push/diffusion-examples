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
import com.pushtechnology.diffusion.client.features.TimeSeries;
import com.pushtechnology.diffusion.client.features.control.topics.TopicControl;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicSpecification;
import com.pushtechnology.diffusion.client.topics.details.TopicType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.Instant;
import java.util.Random;

public class TimeSeriesAppendTimestampExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(TimeSeriesAppendTimestampExample.class);

    public static void main(String[] args) {
        Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        final Random r = new Random();
        final String myTopicPath = "my/time/series/topic/path/user/supplied";
        double myValue;
        Instant myTimeStamp;

        final TimeSeries timeSeries = session.feature(TimeSeries.class);
        final TopicControl topicControl = session.feature(TopicControl.class);

        final TopicSpecification mySpec = Diffusion.newTopicSpecification(TopicType.TIME_SERIES)
            .withProperty(TopicSpecification.TIME_SERIES_EVENT_VALUE_TYPE, DOUBLE_DATATYPE_NAME)
            .withProperty(TopicSpecification.TIME_SERIES_RETAINED_RANGE, "limit 15 last 10s")
            .withProperty(TopicSpecification.TIME_SERIES_SUBSCRIPTION_RANGE, "limit 3");

        topicControl.addTopic(myTopicPath, mySpec)
            .join();

        for (int i = 0; i < 25; i++) {
            myValue = r.nextDouble();
            myTimeStamp = Instant.ofEpochSecond(i);

            timeSeries.append(myTopicPath, Double.class, myValue, myTimeStamp)
                .join();
        }

        LOG.info("Topic has been created.");

        topicControl.removeTopics("?.*//").join();
        session.close();
    }
}
