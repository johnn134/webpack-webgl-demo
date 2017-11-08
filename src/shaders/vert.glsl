attribute vec4 vPosition;

uniform mat4 model;
uniform mat4 view;
uniform mat4 perspective;

void main(void) {
    gl_Position = perspective * view * model * vPosition;
}