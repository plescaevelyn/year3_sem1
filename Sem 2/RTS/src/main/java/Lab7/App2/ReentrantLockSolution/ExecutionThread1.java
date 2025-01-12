package Lab7.App2.ReentrantLockSolution;

import java.util.concurrent.BrokenBarrierException;
import java.util.concurrent.CyclicBarrier;
import java.util.concurrent.locks.ReentrantLock;

public class ExecutionThread1 extends Thread {
    private final ReentrantLock lock;
    private final int sleep;
    private final int activity_min;
    private final int activity_max;
    private final CyclicBarrier cyclicBarrier;

    public ExecutionThread1(ReentrantLock lock, int sleep, int activity_min, int activity_max,
                            CyclicBarrier cyclicBarrier) {
        this.lock = lock;
        this.sleep = sleep;
        this.activity_min = activity_min;
        this.activity_max = activity_max;
        this.cyclicBarrier = cyclicBarrier;
    }

    public void run() {
        System.out.println(this.getName() + " - STATE 1");

        lock.lock();

        System.out.println(this.getName() + " - STATE 2");
        int k = (int) Math.round(Math.random() * (activity_max - activity_min) + activity_min);
        for (int i = 0; i < k * 100000; i++) {
            i++;
            i--;
        }

        try {
            Thread.sleep(Math.round(sleep) * 500);
        } catch (InterruptedException e) {
            e.printStackTrace();
        }

        lock.unlock();

        System.out.println(this.getName() + " - STATE 3");

        try {
            cyclicBarrier.await(); // Wait for other threads to reach the barrier
        } catch (InterruptedException | BrokenBarrierException e) {
            e.printStackTrace();
        }
    }
}
