#include <stdlib.h>
#include <stdio.h>
#include <pwd.h>
#include <shadow.h>
#include <string.h>
#include <crypt.h>
#include <unistd.h>
#include <libgen.h>

int main(int argc, char **argv) {
    struct spwd *pwd;
    if (argc != 3) {
        printf("usage:\n\t%s [username] [password]\n", basename(argv[0]));
        return 0;
    } else if (getuid() == 0) {
        pwd = getspnam(argv[1]);
        return strcmp(crypt(argv[2], pwd->sp_pwdp), pwd->sp_pwdp);
    } else {
        printf("You need to be root\n");
        return 0;
    }
}
