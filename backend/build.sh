#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
JDK_PATH="$DIR/../.jdk"

export JAVA_HOME="$JDK_PATH"
export PATH="$JDK_PATH/bin:$PATH"

mkdir -p "$DIR/target/classes"
cp -r "$DIR/src/main/resources/"* "$DIR/target/classes/" 2>/dev/null || true

CP="$DIR/target/classes:$DIR/src/main/resources"
for jar in $(find /home/mak/.m2/repository -name "*.jar" | grep -v "/org/apache/maven/" | grep -v "/org/codehaus/plexus/" | grep -v "/org/eclipse/sisu/" | grep -v "/org/sonatype/"); do
  CP="$CP:$jar"
done

echo "Compiling backend Java source files..."
javac -parameters -cp "$CP" -d "$DIR/target/classes" $(find "$DIR/src/main/java" -name "*.java")
echo "Compilation completed successfully!"

