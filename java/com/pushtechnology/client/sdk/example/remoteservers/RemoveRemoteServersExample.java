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
package com.pushtechnology.client.sdk.example.remoteservers;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.RemoteServers;
import com.pushtechnology.diffusion.client.features.control.RemoteServers.RemoteServer.ConnectionOption;
import com.pushtechnology.diffusion.client.features.control.RemoteServers.SecondaryInitiator.SecondaryInitiatorBuilder;
import com.pushtechnology.diffusion.client.session.Session;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

public class RemoveRemoteServersExample {

    private static final Logger LOG = LoggerFactory.getLogger(
        RemoveRemoteServersExample.class);

    public static void main(String[] args) throws Exception {

        Session adminSession = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        RemoteServers remoteServersControl =
            adminSession.feature(RemoteServers.class);

        SecondaryInitiatorBuilder builder =
            Diffusion.newRemoteServerBuilder(SecondaryInitiatorBuilder.class);

        Map<ConnectionOption, String> myConnectionOptions = new HashMap<ConnectionOption, String>(){{
            put(ConnectionOption.RECONNECTION_TIMEOUT, "120000");
            put(ConnectionOption.MAXIMUM_QUEUE_SIZE, "1000");
            put(ConnectionOption.CONNECTION_TIMEOUT, "15000");
        }};

        remoteServersControl.createRemoteServer(
            builder
                .principal("admin")
                .credentials(Diffusion.credentials().password("password"))
                .connectionOptions(myConnectionOptions)
                .build("Remote Server 1", "ws://new.server.url.com")
        ).join();

        remoteServersControl.removeRemoteServer("Remote Server 1").join();
        System.out.println("Remote Server 1 has been removed");

        adminSession.close();

        LOG.info("Remote Server 1 has been removed");
    }
}
