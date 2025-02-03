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
package com.pushtechnology.client.sdk.example.pubsub.publish;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.topics.TopicControl;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicType;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletionException;

public class AddTopicExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(AddTopicExample.class);

    public static void main(String[] args)
        throws Throwable {

        try (Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080")) {

            final TopicControl topicControl = session.feature(TopicControl.class);

            final TopicControl.AddTopicResult result =
                topicControl.addTopic(
                        "my/topic/path", Diffusion.newTopicSpecification(TopicType.JSON))
                    .join();

            if (result == TopicControl.AddTopicResult.CREATED) {
                LOG.info("Topic has been created.");
            }
            else {
                LOG.info("Topic already exists.");
            }
        }
        catch (CompletionException e) {
            LOG.error("Failed to add topic.", e);

            throw e.getCause();
        }
    }
}
