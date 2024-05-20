# The following two variables must be set.
#
# Directory containing the C client include files.
# DIFFUSION_C_CLIENT_INCDIR =
#
# Directory containing libdiffusion.a
# DIFFUSION_C_CLIENT_LIBDIR =
#
# Directory containing the various external Diffusion dependencies
# DIFFUSION_C_CLIENT_DEPENDENCIES_DIR =
#
# Directory that will contain the executables and generated objects
# TARGET_FOLDER =

ifndef DIFFUSION_C_CLIENT_INCDIR
$(error DIFFUSION_C_CLIENT_INCDIR is not set)
endif

ifndef DIFFUSION_C_CLIENT_LIBDIR
$(error DIFFUSION_C_CLIENT_LIBDIR is not set)
endif

ifndef TARGET_FOLDER
$(error TARGET_FOLDER is not set)
endif

# Extra definitions from current directory, if they exist.
-include makefile.defs

CFLAGS	+=	$(INCLUDES) \
			-g -std=c99 -D_POSIX_C_SOURCE=200112L -D_XOPEN_SOURCE=700 \
			-Wall -Werror -Wno-error=deprecated-declarations \
			-I$(DIFFUSION_C_CLIENT_INCDIR)

LDFLAGS	+= 	-lpthread -lpcre -lcurl -lz \
			$(DIFFUSION_C_CLIENT_LIBDIR)/$(ARCH)/libdiffusion.a \
			$(LIBS)

# Detect the platform the Diffusion Client will be running on
PLATFORM	= 	$(shell uname -s | tr '[A-Z]' '[a-z]' | sed -e 's/darwin/osx/')

ifeq ($(PLATFORM),osx)
	CC		= 	clang
else
	# If not MacOS, add '-lrt' to the linker flags
	CC		= 	gcc
	LDFLAGS	+=	-lrt
endif

ARFLAGS		+=
SOURCES 	=	connect-async.c \
				connect.c \
				reconnect.c \
				session-factory.c \
				features/authentication_control/auth-service.c \
				features/client-control-change-roles-with-filter.c \
				features/client-control-change-roles-with-session.c \
				features/client-control-close-with-filter.c \
				features/client_control/get-session-properties.c \
				features/client_control/session-properties-listener.c \
				features/messaging/send-request-to-filter.c \
				features/messaging/send-request-to-path.c \
				features/messaging/send-request-to-session.c \
				features/remote_servers/remote-servers.c \
				features/security/change-principal.c \
				features/subscription_control/subscription-control.c \
				features/system_authentication_control/system-auth-control.c \
				features/time_series/time-series-range-query.c \
				features/time_series/time-series-append.c \
				features/time_series/time-series-edit.c \
				features/topic_control/missing-topic-notification.c \
				features/topic_control/add-topics.c \
				features/topic_update/update-record.c \
				features/topic_update/topic-update.c \
				features/topic_update/topic-update-stream.c \
				features/topic_update/topic-update-with-constraint.c \
				features/topic_update/topic-update-add-and-set.c \
				features/topic_views/topic-views.c \
				features/topic_views/topic-views-remove.c \
				features/topic_views/topic-views-list.c \
				features/topics/subscribe.c \
				features/topics/subscribe-multiple.c \
				features/topics/recordv2-topics.c \
				features/topics/string-topics.c \
				features/topics/double-topics.c \
				features/topics/fetch-request.c \
				features/topics/int64-topics.c \
				features/topics/binary-topics.c

OBJ_DIR		= 	$(TARGET_FOLDER)/objs/$(ARCH)
BIN_DIR		= 	$(TARGET_FOLDER)/bin/$(ARCH)
OBJECTS		= 	$(SOURCES:.c=.o)

TARGETS 	= 	connect-async \
				connect \
				reconnect \
				session-factory \
				authentication_control \
				client-control-change-roles-with-filter \
				client-control-change-roles-with-session \
				client-control-close-with-filter \
				client-control-get-session-properties \
				client-control-session-properties-listener \
				messaging-send-request-to-filter \
				messaging-send-request-to-path \
				messaging-send-request-to-session \
				remote-servers \
				security-change-principal \
				subscription-control \
				system-authentication-control \
				time-series-range-query \
				time-series-append \
				time-series-edit \
				topic-control-missing-topic-notification \
				topic-control-add-topics \
				topic-update-record \
				topic-update \
				topic-update-stream \
				topic-update-with-constraint \
				topic-update-add-and-set \
				topic-views \
				topic-views-remove \
				topic-views-list \
				topics-subscribe \
				topics-subscribe-multiple \
				topics-recordv2 \
				topics-string \
				topics-double \
				topics-fetch \
				topics-int64 \
				topics-binary

.PHONY: all

all: prepare $(TARGETS)

prepare:
		mkdir -p $(OBJ_DIR) $(BIN_DIR)

$(OBJ_DIR)/%.o: %.c
		$(CC) $(CFLAGS) -c -o $@ $<

connect-async: $(OBJ_DIR)/connect-async.o
		$(CC) $< $(LDFLAGS) -o $(BIN_DIR)/$@

connect: $(OBJ_DIR)/connect.o
		$(CC) $< $(LDFLAGS) -o $(BIN_DIR)/$@

reconnect: $(OBJ_DIR)/reconnect.o
		$(CC) $< $(LDFLAGS) -o $(BIN_DIR)/$@

session-factory: $(OBJ_DIR)/session-factory.o
		$(CC) $< $(LDFLAGS) -o $(BIN_DIR)/$@

authentication_control: features/authentication_control/auth-service.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

client-control-change-roles-with-filter: features/client_control/change-roles-with-filter.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

client-control-change-roles-with-session: features/client_control/change-roles-with-session.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

client-control-close-with-filter: features/client_control/close-with-filter.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

client-control-get-session-properties: features/client_control/get-session-properties.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

client-control-session-properties-listener: features/client_control/session-properties-listener.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

messaging-send-request-to-filter: features/messaging/send-request-to-filter.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

messaging-send-request-to-path: features/messaging/send-request-to-path.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

messaging-send-request-to-session: features/messaging/send-request-to-session.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

remote-servers: features/remote_servers/remote-servers.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

security-change-principal: features/security/change-principal.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

subscription-control: features/subscription_control/subscription-control.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

system-authentication-control: features/system_authentication_control/system-auth-control.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

time-series-range-query: features/time_series/time-series-range-query.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

time-series-append: features/time_series/time-series-append.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

time-series-edit: features/time_series/time-series-edit.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-control-missing-topic-notification: features/topic_control/missing-topic-notification.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-control-add-topics: features/topic_control/add-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-update-record: features/topic_update/update-record.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-update: features/topic_update/topic-update.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-update-stream: features/topic_update/topic-update-stream.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-update-with-constraint: features/topic_update/topic-update-with-constraint.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-update-add-and-set: features/topic_update/topic-update-add-and-set.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-views: features/topic_views/topic-views.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-views-remove: features/topic_views/topic-views-remove.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topic-views-list: features/topic_views/topic-views-list.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-subscribe: features/topics/subscribe.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-subscribe-multiple: features/topics/subscribe-multiple.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-recordv2: features/topics/recordv2-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-string: features/topics/string-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-double: features/topics/double-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-fetch: features/topics/fetch-request.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-int64: features/topics/int64-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

topics-binary: features/topics/binary-topics.c
		$(CC) $^ $(CFLAGS) $(LDFLAGS) -lm -o $(BIN_DIR)/$@

clean:
		rm -rf $(TARGETS) $(OBJECTS) $(TARGET_FOLDER) core a.out
