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
package com.pushtechnology.client.sdk.example.topicviews.dsl;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.callbacks.ErrorReason;
import com.pushtechnology.diffusion.client.features.Topics;
import com.pushtechnology.diffusion.client.features.control.topics.TopicControl;
import com.pushtechnology.diffusion.client.features.control.topics.views.TopicView;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicSpecification;
import com.pushtechnology.diffusion.client.topics.details.TopicType;
import com.pushtechnology.diffusion.datatype.json.JSON;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TopicViewsDslProcessTransformationSetExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(TopicViewsDslProcessTransformationSetExample.class);

    public static void main(String[] args) {
        Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        final Topics topics = session.feature(Topics.class);
        final TopicSpecification mySpec = Diffusion
            .newTopicSpecification(TopicType.JSON);

        final JSON jsonValue1 = Diffusion.dataTypes().json()
            .fromJsonString("{\n" +
                "  \"account\": \"1234\"," +
                "  \"balance\": {" +
                "    \"amount\": 12.57," +
                "    \"currency\": \"USD\"" +
                "  }" +
                "}");

        topics.addAndSet("my/topic/path/1", mySpec, JSON.class, jsonValue1).join();

        final JSON jsonValue2 = Diffusion.dataTypes().json()
            .fromJsonString("{\n" +
                "  \"account\": \"5678\"," +
                "  \"balance\": {" +
                "    \"amount\": 98.76," +
                "    \"currency\": \"USD\"" +
                "  }" +
                "}");

        topics.addAndSet("my/topic/path/2", mySpec, JSON.class, jsonValue2).join();
        topics.addFallbackStream(JSON.class, new MyFallbackStream());
        topics.subscribe("?views//").join();

        TopicView myTopicView = topics.createTopicView("topic_view_1",
                "map ?my/topic/path// to views/<path(3)> process {\n" +
                    "  if '/balance/amount > 20'\n" +
                    "    set(/Tier, 1)\n" +
                    "  else\n" +
                    "    set(/Tier, 2)\n" +
                    "}\n" +
                    "process {\n" +
                    "  set(/balance/amount_in_cents, calc '/balance/amount * " +
                    "100')\n" +
                    "}")
            .join();

        System.out.println("Topic View topic_view_1 has been created");

        topics.removeTopicView("topic_view_1").join();
        session.feature(TopicControl.class).removeTopics("?.*//").join();
        session.close();

        LOG.info("Topic View {} has been created", myTopicView.getName());
    }

    static class MyFallbackStream implements Topics.ValueStream<JSON> {

        @Override
        public void onSubscription(String topicPath,
            TopicSpecification topicSpecification) {
            System.out.printf("Subscribed to %s\n", topicPath);
        }

        @Override
        public void onUnsubscription(String topicPath,
            TopicSpecification topicSpecification,
            Topics.UnsubscribeReason unsubscribeReason) {}

        @Override
        public void onClose() {}

        @Override
        public void onError(ErrorReason errorReason) {}

        @Override public void onValue(String s,
            TopicSpecification topicSpecification, JSON json, JSON v1) {}
    }
}
