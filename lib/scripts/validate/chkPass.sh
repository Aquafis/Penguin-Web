#!/bin/bash
uid=`id -u`

if [ $uid -ne 0 ]; then 
    echo "You must be root to run this"
    exit 1
fi

if [ $# -lt 1 ]; then
    echo "You must supply a username to check - ($# supplied)"
    exit 1
fi

username=$1
salt=`grep $username /etc/shadow | awk -F: ' {print substr($2,4,8)}'`

if [ "$salt" != "" ]; then

        newpass=`openssl passwd -1 -salt $salt`
        grep $username  /etc/shadow | grep -q  $newpass && echo "Success" || echo "Failure"

fi
