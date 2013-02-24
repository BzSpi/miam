<?php

/**
 * Database access abtract class
 *
 * @author Spi
 */
abstract class Database {
  /**
   * Retrieves records from database
   *
   * @param $query the select query to run
   * @return DatabaseIterator an iterator on the records
   */
  public abstract function select($query);

  /**
   * Updates records in the database
   *
   * @param $query the update query to run
   */
  public abstract function update($query);

  /**
   * Inserts records in the database
   *
   * @param $query the insert query to run
   * @return int The id of the inserted record
   */
  public abstract function insert($query);

  /**
   * Dletes records in the database
   * @param $query the delete query to run
   */
  public abstract function delete($query);

  /**
   * Returns an instace of the Database obecjt
   *
   * @return Database an instance
   */
  public abstract static function getInstance();
}
