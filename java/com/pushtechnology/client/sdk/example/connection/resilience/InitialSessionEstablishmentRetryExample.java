/*******************************************************************************
 * Copyright (C) 2023 - 2026 DiffusionData Ltd.
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
package com.pushtechnology.client.sdk.example.connection.resilience;

import java.util.concurrent.TimeUnit;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.session.Session;
import com.pushtechnology.diffusion.client.session.retry.RetryPolicy;

/**
 * This example demonstrates how to configure an initial retry policy for
 * session establishment.
 * <P>
 * The example sets up a retry policy with a specified interval and number of
 * attempts for retrying a failed attempt to establish a session.
 *
 * @author DiffusionData Limited
 */
public class InitialSessionEstablishmentRetryExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(InitialSessionEstablishmentRetryExample.class);

    public static void main(String[] args) {

        final RetryPolicy retryPolicy = Diffusion.newRetryPolicyBuilder()
            .interval(250, TimeUnit.MILLISECONDS)
            .attempts(10)
            .build();

        final Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .initialRetryPolicy(retryPolicy)
            .open("ws://localhost:8080");

        LOG.info("Connected, session identifier: '{}'.", session.getSessionId());

        // Insert work here

        session.close();
    }
}
