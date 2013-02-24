<?php

require_once(__DIR__.'/Database.class.php');
require_once(__DIR__.'/DatabaseException.class.php');
require_once(__DIR__.'/MySqlDatabaseIterator.class.php');

/**
 * Access to database of type MySql
 *
 * @author Spi
 */
class MySqlDatabase extends Database {
  protected static $host, $user, $password, $dbName, $instance;
  protected $conn;

  protected function __construct()
  {
    $this->conn = new mysqli(self::$host, self::$user, self::$password, self::$dbName);
  }

  public static function getInstance()
  {
    if(!isset(self::$instance))
    {
      self::$instance = new MySqlDatabase();
    }
    return self::$instance;
  }

  public static function configure($host, $user, $password, $dbName)
  {
    if(isset(self::$user))
      throw new DatabaseException ('Cannot configure MySql database twice');

    self::$host = $host;
    self::$user = $user;
    self::$password = $password;
    self::$dbName = $dbName;
  }

  public function select($query)
  {
    try
    {
      $rs = $this->conn->query($query);
      if($rs === false)
        throw new DatabaseException(sprintf('Failed to execute select query : (%s) %s', $this->conn->errno, $this->conn->error));
      return new MySqlDatabaseIterator($rs);
    }
    catch(DatabaseException $e)
    {
      throw $e;
    }
    catch(Exception $e)
    {
      throw new DatabaseException(sprintf('Failed to execute insert query : %s', $e->getMessage()));
    }
  }

  public function update($query)
  {
    try
    {
      $ret = $this->conn->query($query);
      if($ret === false)
        throw new DatabaseException(sprintf('Failed to execute update query : (%s) %s', $this->conn->errno, $this->conn->error));
    }
    catch(DatabaseException $e)
    {
      throw $e;
    }
    catch(Exception $e)
    {
      throw new DatabaseException(sprintf('Failed to execute insert query : %s', $e->getMessage()));
    }
  }

  public function insert($query)
  {
    try
    {
      $ret = $this->conn->query($query);
      if($ret === false)
        throw new DatabaseException(sprintf('Failed to execute insert query : (%s) %s', $this->conn->errno, $this->conn->error));
    return $this->conn->insert_id;
    }
    catch(DatabaseException $e)
    {
      throw $e;
    }
    catch(Exception $e)
    {
      throw new DatabaseException(sprintf('Failed to execute insert query : %s', $e->getMessage()));
    }
  }

  public function delete($query)
  {
    try
    {
      $ret = $this->conn->query($query);
      if($ret === false)
        throw new DatabaseException(sprintf('Failed to execute delete query : (%s) %s', $this->conn->errno, $this->conn->error));
    }
    catch(DatabaseException $e)
    {
      throw $e;
    }
    catch(Exception $e)
    {
      throw new DatabaseException(sprintf('Failed to execute insert query : %s', $e->getMessage()));
    }
  }
}
