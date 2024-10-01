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
import com.pushtechnology.diffusion.client.features.TopicCreationResult;
import com.pushtechnology.diffusion.client.features.TopicUpdate;
import com.pushtechnology.diffusion.client.features.UpdateStream;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicType;
import com.pushtechnology.diffusion.datatype.json.JSON;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.CompletionException;

public class AddAndSetTopicViaUpdateStreamExample {
    private static final Logger LOG = LoggerFactory.getLogger(AddAndSetTopicViaUpdateStreamExample.class);

    public static void main(String[] args)
        throws Throwable {

        try (Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080")) {

            final TopicUpdate topicUpdate = session.feature(TopicUpdate.class);

            final UpdateStream<JSON> updateStream = topicUpdate.newUpdateStreamBuilder()
                .specification(Diffusion.newTopicSpecification(TopicType.JSON))
                .build("my/topic/path/with/update/stream", JSON.class);

            final JSON jsonValue = Diffusion.dataTypes().json()
                .fromJsonString("{ \"diffusion\": \"data\" }");

            final TopicCreationResult result =
                updateStream.set(jsonValue)
                    .join();

            if (result == TopicCreationResult.CREATED) {
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
