<?php

// Statistiques du nombre de connexions à l'application
$filename = "stats.json";
$current = json_decode(file_get_contents($filename), true);
$current["views"]++;
file_put_contents($filename, json_encode($current, JSON_PRETTY_PRINT));
echo $current["views"];

?>