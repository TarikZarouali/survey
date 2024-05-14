<?php

class Helper {
    public static function dump($data)
    {
        echo '<pre><code>';
        print_r($data);
        echo '</code></pre>';
    }

    public static function log($type, $data)
    {
        if ($type == 'event') {
            // Your existing code for 'event'
            error_log('Event: ' . date('Ymd h:i:s') . " - " . $data);
        } else if ($type == 'error' || $type == 'debug') {
            $bt = debug_backtrace();
            $caller = array_shift($bt);

            // Check if $data is an array
            if (is_array($data)) {
                // Convert array to a string for logging
                $data = print_r($data, true);
            }

            error_log($type . ': ' . date('Ymd h:i:s') . " - " . $caller['line'] . ' ' . $caller['file'] . "\n" . $data);
        }
    }

    public static function crypt($action, $string)
    {
        $output = false;

        $encrypt_method = "AES-256-CBC";
        $secret_key = 'This is my secret key';
        $secret_iv = 'This is my secret iv';

        // hash
        $key = hash('sha256', $secret_key);

        // iv - encrypt method AES-256-CBC expects 16 bytes - else you will get a warning
        $iv = substr(hash('sha256', $secret_iv), 0, 16);

        if ($action == 'encrypt') {
            $output = openssl_encrypt($string, $encrypt_method, $key, 0, $iv);
            $output = base64_encode($output);
        } else if ($action == 'decrypt') {
            $output = openssl_decrypt(base64_decode($string), $encrypt_method, $key, 0, $iv);
        }

        return $output;
    }

    public static function generateRandomString($length = 10)
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $charactersLength = strlen($characters);
        $randomString = '';

        for ($i = 0; $i < $length; $i++) {
            $randomString .= $characters[random_int(0, $charactersLength - 1)];
        }
        return $randomString;
    }

    public static function formatTime($hours, $minutes) {
        $ampm = $hours >= 12 ? "pm" : "am";
        $formattedHours = $hours % 12 || 12;
        $formattedMinutes = $minutes < 10 ? "0" . $minutes : $minutes;
        return "$formattedHours:$formattedMinutes $ampm";
    }
    
}


?>