#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JDK_PATH="$DIR/../.jdk"

export JAVA_HOME="$JDK_PATH"
export PATH="$JDK_PATH/bin:$PATH"

# Build runtime classpath from ~/.m2/repository and compiled classes
CP="$DIR/target/classes:$DIR/src/main/resources"
for jar in $(find /home/mak/.m2/repository -name "*.jar" | grep -v "/org/apache/maven/" | grep -v "/org/codehaus/plexus/" | grep -v "/org/eclipse/sisu/" | grep -v "/org/sonatype/"); do
  CP="$CP:$jar"
done

echo "Starting BackendApplication with JDK 21 on port 8081..."
exec java -cp "$CP" com.cep.backend.BackendApplication --server.port=8081 "$@"

