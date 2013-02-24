<?php

require_once(__DIR__.'/Database.class.php');
require_once(__DIR__.'/MySqlDatabase.class.php');

/**
 * Create a database access from configuration file
 *
 * @author Spi
 */
class DatabaseFactory {
  protected static $dbInstance;

  /**
   * Returns a database access
   *
   * @return Database a database access
   * @throws Exception
   */
  public static function getDatabase()
  {
    if(!isset(self::$dbInstance))
    {
      $configFilePath = __DIR__.'/../../config/config.php';

      if(!file_exists($configFilePath))
        throw new Exception('Config file does not exists');

      require $configFilePath;

      MySqlDatabase::configure($config['database']['host'], $config['database']['user'], $config['database']['password'], $config['database']['name']);
      self::$dbInstance = MySqlDatabase::getInstance();
    }
    return self::$dbInstance;
  }
}
