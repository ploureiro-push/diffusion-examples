package com.pushtechnology.client.sdk.example.serverconfiguration.systemauthenticationcontrol;

import java.util.Collections;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.pushtechnology.diffusion.client.Diffusion;
import com.pushtechnology.diffusion.client.features.control.clients.SystemAuthenticationControl;
import com.pushtechnology.diffusion.client.session.Session;

public class ChangePrincipalPasswordExample {

    private static final Logger LOG =
        LoggerFactory.getLogger(ChangePrincipalPasswordExample.class);

    public static void main(String[] args) {

        final Session session = Diffusion.sessions()
            .principal("admin")
            .password("password")
            .open("ws://localhost:8080");

        final SystemAuthenticationControl authenticationControl =
            session.feature(SystemAuthenticationControl.class);

        String updateScript = authenticationControl.scriptBuilder()
            .addPrincipal(
                "super_user",
                "password12345",
                Collections.singleton("CLIENT"))
            .script();

        authenticationControl.updateStore(updateScript).join();

        updateScript = authenticationControl.scriptBuilder()
            .setPassword("super_user", "myNewPassword")
            .script();

        authenticationControl.updateStore(updateScript).join();

        final Session superSession = Diffusion.sessions()
            .principal("super_user")
            .password("myNewPassword")
            .open("ws://localhost:8080");

        LOG.info("connected as {}", superSession.getPrincipal());

        superSession.close();
        session.close();
    }
}
