#!/bin/bash

ROOT_DIR=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
SOURCE_DIR="$ROOT_DIR"
TARGET_DIR="$ROOT_DIR/target"


if [ ! -d $TARGET_DIR ]; then
    echo "Creating folder $TARGET_DIR"
    mkdir -p $TARGET_DIR
fi


function build_linux() {
    build_for_unix "x86_64" "linux" false
}


function build_macos() {
    build_for_unix "x86_64" "macos" true
    build_for_unix "arm64" "macos" true
}


function build_for_unix() {
    local architecture=$1
    local operating_system=$2
    local is_macos=$3
    local cmake_dir="$TARGET_DIR/cmake-$operating_system-$architecture"
    IFS='' read -r -d '' BUILD_CMD << EOF
cmake --fresh           \
    -S"$SOURCE_DIR"                         \
    -B"$cmake_dir"                          \
    -DTARGET="$TARGET_DIR"                  \
    -DOPERATING_SYSTEM="$operating_system"  \
    -DARCHITECTURE="$architecture"

cmake --build "$cmake_dir"
EOF
    if $is_macos ; then
        if [[ "$architecture" == "x86_64" ]]; then
            /usr/local/bin/brew shellenv

        elif [[ "$architecture" == "arm64" ]]; then
            /opt/homebrew/bin/brew shellenv
        fi
        arch "-$architecture" "$BUILD_CMD"
    else
      "${BUILD_CMD}"
    fi

}



case "$OSTYPE" in
  solaris*) build_linux ;;
  darwin*)  build_macos ;;
  linux*)   build_linux ;;
  bsd*)     build_linux ;;
  *)        echo "unknown: $OSTYPE"; exit 1 ;;
esac
