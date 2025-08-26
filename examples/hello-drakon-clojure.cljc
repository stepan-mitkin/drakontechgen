(ns hello3.hello-drakon-clojure)
(declare moo) (declare fibonacci)

(defn a-print-of-fibonacci [n]
  (println (map fibonacci (range n))))

(defn foo []
  (moo))

(defn bar []
  (foo))

(defn test-dependencies []
  (bar))

(defn run-me []
  (a-print-of-fibonacci 5)
  (test-dependencies))

(defn f03 []
  (println "f03"))

(defn f02 []
  (f03))

(defn f01 []
  (f02))

(defn by-two [arg]
  (* arg 2))

(defn hello [first-name second-name]
  (println "hello")
  (println first-name second-name))

(defn hello-world []
  (println "Hello world!"))

(defn no-content [])

(defn only-no [value]
  (if (not (> value 0))
    (println "non-positive")
    (do)))

(defn select-case [value]
  (let [value2 (* value 2)]
    (if (= (inc value2) 1)
      "one"
      (if (= (inc value2) 5)
        "five"
        (if (not (= (inc value2) 7))
          (throw
            (RuntimeException.
              (str "Unexpected case value" ": " (inc value2))))
          "seven")))))

(defn short-circuit-and [a b]
  (if (and (> a 0) (> b 0))
    "positive"
    (if (or a b)
      "other"
      "unknown")))

(defn silhouette [left right]
  (if (> left right)
    (let [result left]
      result)
    (let [result right]
      result)))

(defn fibonacci [n]
  (if (<= n 1)
    (do
      (println "trivial case, n =" n)
      n)
    (let [n-2 (fibonacci (- n 2)) n-1 (fibonacci (- n 1))]
      (by-two (+ n-2 n-1)))))

(defn moo []
  (println "This is moo"))

(run-me)