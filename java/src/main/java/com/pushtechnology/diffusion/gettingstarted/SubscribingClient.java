/*******************************************************************************
 * Copyright (C) 2014, 2017 Push Technology Ltd.
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
package com.pushtechnology.diffusion.gettingstarted;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.content.Content;
import com.pushtechnology.diffusion.client.features.Topics;
import com.pushtechnology.diffusion.client.features.Topics.ValueStream;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.topics.details.TopicSpecification;
import com.pushtechnology.diffusion.datatype.json.JSON;

/**
 * A client that subscribes to the JSON topic 'foo/counter.
 *
 * @author Push Technology Limited
 * @since 5.9
 */
public class SubscribingClient {

    /**
     * Main.
     */
    public static void main(String... arguments) throws Exception {

        // Connect anonymously
        // Replace 'host' with your hostname
        final Session session = Diffusion.sessions()
						                .open("ws://host:8080");

        // Get the Topics feature to subscribe to topics
        final Topics topics = session.feature(Topics.class);

        // Add a new stream for 'foo/counter'
        topics.addStream("foo/counter", JSON.class, new Topics.ValueStream.Default<JSON>() {
            @Override
            public void onSubscription(String topicPath, TopicSpecification specification) {
                System.out.println("Subscribed to: " + topicPath);
            }

            @Override
            public void onValue(String topicPath, TopicSpecification specification, JSON oldValue, JSON newValue) {
                System.out.println(topicPath + " : " + newValue.toJsonString());
            }
        });
        
        // Subscribe to the topic 'foo/counter'
        topics.subscribe("foo/counter", new Topics.CompletionCallback.Default());

        // Wait for a minute while the stream prints updates
        Thread.sleep(60000);
    }

    /**
     * A topic stream that prints updates to the console.
     */
    private static class ValueStreamPrintLn extends ValueStream.Default<Content> {
        @Override
        public void onValue(
            String topicPath,
            TopicSpecification specification,
            Content oldValue,
            Content newValue) {
            System.out.println(topicPath + ":   " + newValue.asString());
        }
    }
}