<?php

/**
 * Iterator for database results
 *
 * @author Spi
 */
abstract class DatabaseIterator {
  /**
   * Checks if there is more results in database
   *
   * @return bool true if there is more results
   */
  abstract function next();

  /**
   * Returns the next database result as an associative array
   *
   * @return array the next result of the iterator
   */
  abstract function hasNext();
}
