<?php
/* PHP运行时间&内存消耗统计工具
 * 精确度：
 * 	不足24小时：0.01秒(10毫秒)～24小时
 * 	超过24小时：1秒～数天
 */
// 开始的时钟时间（秒）
$huafei_time_start = microtime(true);
function changeTimeType()
{
	// 结束的时钟时间（秒）
	$huafei_time_end = microtime(true);
	// 计算脚本执行时间
	$seconds = ($huafei_time_end - $GLOBALS['huafei_time_start']);
	if ($seconds > 3600) {
		$hours = intval($seconds / 3600);
		$minutes = $seconds % 3600;
		$time = $hours . "小时" . gmstrftime('%M分钟%S秒', $minutes);
	} else {
		$jingduS = mb_substr($seconds, stripos($seconds, '.'), 3);
		$time = gmstrftime('%H小时%M分钟%S' . $jingduS . '秒', $seconds);
		if (mb_substr($time, 0, 2) == '00') {
			$time = gmstrftime('%M分钟%S' . $jingduS . '秒', $seconds);
		}
		if (mb_substr($time, 0, 2) == '00') {
			//诡异的if语句，因为$time在上一个if语句被修改了所以此处不是mb_substr($time,4,2)，而是mb_substr($time,0,2)
			$time = gmstrftime('%S' . $jingduS . '秒', $seconds);
		}
		if (mb_substr($time, 0, 2) == '00') {
			$time = gmstrftime('0' . $jingduS . '秒', $seconds);
			if ($jingduS == '0') {
				$time = '0秒';
			}
		}
	}
	//分配给PHP的总内存
	$neicun_zong = memory_get_usage(true);
	$neicun_zong_kb = $neicun_zong / 1024;
	$neicun_zong_out = $neicun_zong_kb . ' ' . 'KB';
	if ($neicun_zong_kb > 10240) {
		$neicun_zong_mb = $neicun_zong_kb / 1024;
		$neicun_zong_out = $neicun_zong_mb . ' ' . 'MB';
	}
	if ($neicun_zong_mb > 10240) {
		$neicun_zong_gb = $neicun_zong_mb / 1024;
		$neicun_zong_out = $neicun_zong_gb . ' ' . 'GB';
	}
	//PHP实际使用的内存
	$neicun_yong = memory_get_usage(false);
	$neicun_yong_kb = $neicun_yong / 1024;
	$neicun_yong_out = $neicun_yong_kb . ' ' . 'KB';
	if ($neicun_yong_kb > 10240) {
		$neicun_yong_mb = $neicun_yong_kb / 1024;
		$neicun_yong_out = $neicun_yong_mb . ' ' . 'MB';
	}
	if ($neicun_yong_mb > 10240) {
		$neicun_yong_gb = $neicun_yong_mb / 1024;
		$neicun_yong_out = $neicun_yong_gb . ' ' . 'GB';
	}
	echo 'PHP：总内存「' . $neicun_zong_out . '」' . ' ' . '消耗内存「' . $neicun_yong_out . '」' . ' ' . '耗时「' . $time . '」';
}
register_shutdown_function("changeTimeType");
/*PHP运行时间&内存消耗统计结束*/
