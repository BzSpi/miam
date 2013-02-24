<?php

require_once(__DIR__.'/DatabaseIterator.class.php');

/**
 * Iterator for MySql database results
 *
 * @author Spi
 */
class MySqlDatabaseIterator extends DatabaseIterator
{
  protected $rs, $current, $hasNext = false;

  public function __construct(mysqli_result $rs)
  {
    $this->rs = $rs;
    $this->forward();
  }

  /**
   * @see DatabaseIterator::next()
   */
  public function next()
  {
    $ret = $this->current;
    $this->forward();
    return $ret;
  }

  /**
   * @see DatabaseIterator::hasNext()
   */
  public function hasNext()
  {
    return $this->hasNext;
  }

  /**
   * Free the database result resource on destroy
   * @see http://www.php.net/manual/en/language.oop5.decon.php#object.destruct
   */
  public function __destruct()
  {
    $this->rs->free();
  }

  /**
   * Fetches the next result and update the "hasNext" property
   */
  protected function forward()
  {
    $this->current = $this->rs->fetch_assoc();
    $this->hasNext = isset($this->current);
  }
}
